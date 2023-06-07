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

const DEBUG_RESPONSES = false;

// Basic set up directly to OpenAI API (not through LangChain) - so we can request
// available engines and other data
const configuration = new Configuration( {
  organization: process.env.OPENAI_ORGANIZATION,
  apiKey: process.env.OPENAI_API_KEY
} );
const openai = new OpenAIApi( configuration );

// Traning documents will be read when uploaded and stored in this array.
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
      useContextualCompression: false
    }, options );

    // Temperature needs to be within 0 and 1 and a number
    const temperature = Math.min( Math.max( parseInt( options.temperature, 10 ), 0.0 ), 1.0 );

    // enforce numbers
    const splitterChunkSize = parseInt( options.splitterChunkSize, 10 );
    const splitterChunkOverlap = parseInt( options.splitterChunkOverlap, 10 );

    const splitter = RecursiveCharacterTextSplitter.fromLanguage( 'markdown', {
      chunkSize: splitterChunkSize,
      chunkOverlap: splitterChunkOverlap
    } );

    // Create documents from the training documents.
    if ( trainingDocumentPaths.length === 0 ) {
      throw new Error( 'No training documents have been uploaded yet.' );
    }

    // We have to re-read the document each time because the user is likely editing these files
    const documentContents = [];
    trainingDocumentPaths.forEach( filePath => {
      const fileContents = fs.readFileSync( filePath, 'utf-8' );
      documentContents.push( fileContents );
    } );
    const documents = await splitter.createDocuments( documentContents );

    console.log( 'COMPRESSION', options.useContextualCompression );
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
      const messages = documents.map( doc => new SystemChatMessage( doc.pageContent ) );
      messages.push( new HumanChatMessage( 'Please do your best to provide code samples for the following request. If you are unsure of your response DO NOT generate any code.' ) );
      messages.push( new HumanChatMessage( prompt ) );

      // Returns an AIChatMessage with structure { type: 'ai', content: string } when converted to JSON, so
      // we just return the text.
      const response = await chatModel.call( messages );
      return {
        text: response.text
      };
    }
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
      trainingDocumentPaths.push( file.path );
    } );

    // delete the uploaded files after reading contents
    // files.forEach( file => {
    //   fs.unlinkSync( file.path );
    // } );
  }
}

module.exports = LangChainManager;