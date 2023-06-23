const { HumanChatMessage, SystemChatMessage } = require( 'langchain/schema' );
const { ChatOpenAI } = require( 'langchain/chat_models/openai' );
const { OpenAI } = require( 'langchain/llms/openai' );
const { RetrievalQAChain } = require( 'langchain/chains' );
const { SupportedTextSplitterLanguages, RecursiveCharacterTextSplitter } = require( 'langchain/text_splitter' );
const { OpenAIEmbeddings } = require( 'langchain/embeddings/openai' );
const { HNSWLib } = require( 'langchain/vectorstores/hnswlib' );
const { ContextualCompressionRetriever } = require( 'langchain/retrievers/contextual_compression' );
const { LLMChainExtractor } = require( 'langchain/retrievers/document_compressors/chain_extract' );
const fs = require( 'fs' );
const _ = require( 'lodash' );
const { Configuration, OpenAIApi } = require( 'openai' );

// console.log( SupportedTextSplitterLanguages );
// cpp
// java
// php
// python
// ruby
// scala
// markdown
// html
// go
// js
// proto
// rst
// rust
// swift
// latex

const DEBUG_RESPONSES = false;
const DEFAULT_FILES = [
  { path: './server/training-files/functions.json', name: 'functions.json' }
];

// Basic set up directly to OpenAI API (not through LangChain) - so we can request
// available engines and other data
const configuration = new Configuration( {
  organization: process.env.OPENAI_ORGANIZATION,
  apiKey: process.env.OPENAI_API_KEY
} );
const openai = new OpenAIApi( configuration );

// Traning documents will be read when uploaded and stored in this array.
// { path: string, name: string }
const trainingDocumentPaths = [];

class LangChainManager {
  constructor() {}

  /**
   * Test the connection by sending a simple chat message to OpenAI.
   * @return {Promise<*>}
   */
  static async connect() {
    if ( DEBUG_RESPONSES ) {
      return {
        text: 'Connection successful! (Test mode)'
      };
    }
    else {
      const chatModel = new ChatOpenAI( { openAIApiKey: process.env.OPENAI_API_KEY, temperature: 0.5 } );
      const response = await chatModel.call( [
        new SystemChatMessage(
          'Checking OpenAI connection...'
        )
      ] );

      // Provide the format of chain.call, so client code uses the same API
      return {
        text: response.text
      };
    }
  }

  /**
   * Ask OpenAI directly for the available engines. Returns a list of the names
   * of all of the available OpenAI engines.
   * @return {Promise<string[]>}
   */
  static async getEngines() {
    if ( DEBUG_RESPONSES ) {
      return [ 'gpt-3.5-turbo', 'curie', 'babbage', 'ada' ];
    }
    else {
      const response = await openai.listEngines();
      const engines = response.data.data;
      const engineNames = engines.map( engine => engine.id );
      return engineNames;
    }
  }

  /**
   * Make a test query to the OpenAI API through LangChain.
   * @param {string} prompt - User prompt to forward after training.
   * @return {Promise<*>}
   */
  static async testQuery( prompt, options ) {
    if ( DEBUG_RESPONSES ) {
      return {
        text: 'This is a test response from the server.'
      };
    }

    options = _.merge( {
      temperature: 0.0,
      modelName: 'gpt-3.5-turbo',
      splitterChunkSize: 128,
      splitterChunkOverlap: 25,
      useContextualCompression: false,
      preTrainMessage: '',
      postTrainMessage: ''
    }, options );

    // Temperature needs to be within 0 and 1 and a number
    const temperature = Math.min( Math.max( parseInt( options.temperature, 10 ), 0.0 ), 1.0 );

    // enforce numbers
    const splitterChunkSize = parseInt( options.splitterChunkSize, 10 );
    const splitterChunkOverlap = parseInt( options.splitterChunkOverlap, 10 );

    // For debugging purposes, include some training files by default.
    if ( DEFAULT_FILES.length > 0 ) {
      trainingDocumentPaths.length = 0;
      trainingDocumentPaths.push( ...DEFAULT_FILES );
    }

    // Create documents from the training documents.
    if ( trainingDocumentPaths.length === 0 ) {
      throw new Error( 'No training documents have been uploaded yet.' );
    }

    // training document paths need to have the same file extension
    const allMarkdown = _.every( trainingDocumentPaths, path => path.name.endsWith( '.md' ) );
    const allJs = _.every( trainingDocumentPaths, path => path.name.endsWith( '.js' ) );
    const allJSON = _.every( trainingDocumentPaths, path => path.name.endsWith( '.json' ) );
    if ( !allMarkdown && !allJs && !allJSON ) {
      throw new Error( 'All training documents must have the same file extension.' );
    }

    if ( allJSON ) {

      // JSON cannot be parsed by the text splitter so we are on our own for this file type.
      if ( trainingDocumentPaths.length > 1 ) {
        throw new Error( 'Only one JSON file can be uploaded at a time.' );
      }

      // We have to re-read the document each time because the user is likely editing these files
      const fileContents = fs.readFileSync( './server/training-files/functions.json', 'utf8' );

      // assemble messages
      const messages = [];
      if ( options.preTrainMessage ) {
        messages.push( { role: 'system', content: options.preTrainMessage } );
      }
      messages.push( { role: 'system', content: JSON.stringify( fileContents ) } );
      messages.push( { role: 'user', content: prompt } );
      if ( options.postTrainMessage ) {
        messages.push( { role: 'system', content: options.postTrainMessage } );
      }

      const chatCompletion = await openai.createChatCompletion( {
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: temperature
      } );

      const messageResponse = chatCompletion.data.choices[ 0 ].message;

      // now look back on the message and make sure that the output conforms to the expected format
      const validationMessages = [
        { role: 'system', content: 'I have the following JSON schema:' },
        { role: 'system', content: JSON.stringify( fileContents ) },
        { role: 'system', content: 'Recreate the the following JSON, making sure that the values are valid according to teh schema. If it is correct, just print it again.' },
        { role: 'system', content: messageResponse.content }
      ];

      console.log( 'VALIDATING....' );
      const validateCompletion = await openai.createChatCompletion( {
        model: 'gpt-3.5-turbo',
        messages: validationMessages,
        temperature: temperature
      } );
      const validatedResponse = validateCompletion.data.choices[ 0 ].message;

      return {
        text: validatedResponse.content
      };
    }
    else {

      // Using Langchain and text splitting for the supported file types

      // Get the language from the file extension
      const splitterLanguage = trainingDocumentPaths[ 0 ].name.endsWith( '.md' ) ? 'markdown' : 'js';

      // We have to re-read the document each time because the user is likely editing these files
      const documentContents = [];

      trainingDocumentPaths.forEach( filePath => {
        const fileContents = fs.readFileSync( filePath.path, 'utf-8' );
        documentContents.push( fileContents );
      } );

      const splitter = RecursiveCharacterTextSplitter.fromLanguage( splitterLanguage, {
        chunkSize: splitterChunkSize,
        chunkOverlap: splitterChunkOverlap
      } );

      const documents = await splitter.createDocuments( documentContents );

      if ( options.useContextualCompression ) {

        const chatModel = new OpenAI( {
          openAIApiKey: process.env.OPENAI_API_KEY,
          temperature: temperature,
          modelName: options.modelName
        } );

        // Create a vector store from the documents.
        const vectorStore = await HNSWLib.fromDocuments( documents, new OpenAIEmbeddings() );

        const baseCompressor = LLMChainExtractor.fromLLM( chatModel );

        // Set up a retreiver that will only include the relevant portions of the documentation to include
        // in the query.
        const retriever = new ContextualCompressionRetriever( {
          baseCompressor,
          baseRetriever: vectorStore.asRetriever()
        } );
        const chain = RetrievalQAChain.fromLLM( chatModel, retriever );

        // const relevantDocuments = retriever.getRelevantDocuments( 'What code should I write to draw a circle using scenery?' );
        // console.log( relevantDocuments );

        // Returns an object with { text: string }
        const res = await chain.call( {
          query: prompt
        } );
        return res;
      }
      else {

        // A chat model is the only model that lets us submit many messages for a response. We must use
        // gpt-3.5-turbo for this.
        const chatModel = new ChatOpenAI( {
          openAIApiKey: process.env.OPENAI_API_KEY,
          temperature: temperature
        } );

        // Just feed every document into the AI with a series of messages and then the prompt.
        const messages = documents.map( doc => new HumanChatMessage( doc.pageContent ) );
        options.preTrainMessage.length > 0 && messages.unshift( new HumanChatMessage( options.preTrainMessage ) );
        options.postTrainMessage.length > 0 && messages.push( new HumanChatMessage( options.postTrainMessage ) );
        messages.push( new HumanChatMessage( prompt ) );

        // Returns an AIChatMessage with structure { type: 'ai', content: string } when converted to JSON, so
        // we just return the text.
        const response = await chatModel.call( messages );
        return {
          text: response.text
        };
      }
    }
  }

  static async testFunctionCalling( prompt, options ) {
    if ( DEBUG_RESPONSES ) {
      return {
        text: 'This is a test response from the server, with function calling'
      };
    }

    options = _.merge( {
      temperature: 0.0
    }, options );

    // Temperature needs to be within 0 and 1 and a number
    const temperature = Math.min( Math.max( parseInt( options.temperature, 10 ), 0.0 ), 1.0 );

    // We have to re-read the document each time because the user is likely editing these files
    const fileContents = fs.readFileSync( './server/training-files/functions.json', 'utf8' );
    const json = JSON.parse( fileContents );

    if ( !json.functions ) {
      throw new Error( 'functions.json must contain a "functions" property with an array of functions.' );
    }

    const chatCompletion = await openai.createChatCompletion( {
      model: 'gpt-3.5-turbo-0613',
      messages: [
        { role: 'system', content: 'Use the information in this thread to populate the arguments of the function called in this message! Do not stray from the schema at all.' },
        { role: 'user', content: prompt }
      ],
      functions: json.functions,
      temperature: temperature
    } );

    const messageResponse = chatCompletion.data.choices[ 0 ].message;
    const functionArguments = messageResponse.function_call.arguments;

    return {
      text: functionArguments
    };
  }

  /**
   * Upload training documents for the model to use.
   * @param files
   * @return {Promise<void>}
   */
  static async uploadTrainingDocuments( files ) {

    // clear documents on a new upload
    trainingDocumentPaths.length = 0;

    // Process the uploaded files
    files.forEach( file => {
      console.log( file.originalname );
      trainingDocumentPaths.push( { path: file.path, name: file.originalname } );
    } );
  }
}

module.exports = LangChainManager;