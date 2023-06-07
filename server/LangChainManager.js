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

// const chatModel = new ChatOpenAI( { openAIApiKey: process.env.OPENAI_API_KEY, temperature: 0.0 } );
// const model = new OpenAI( { openAIApiKey: process.env.OPENAI_API_KEY, temperature: 0.0 } );

// console.log( SupportedTextSplitterLanguages ); // Array of supported languages

// const sceneryDoc = fs.readFileSync( './server/training-files/scenery-doc.md', 'utf8' );
// const paperLandDoc = fs.readFileSync( './docs/use/board-api.md', 'utf8' );

// Traning documents will be read when uploaded and stored in this array.
const trainingDocuments = [];

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
      modelName: 'gpt-3.5-turbo'
    }, options );

    // Temperature needs to be within 0 and 1
    const temperature = Math.min( Math.max( options.temperature, 0.0 ), 1.0 );

    console.log( 'temperature', temperature );
    console.log( 'modelName', options.modelName );

    const chatModel = new OpenAI( {
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: temperature,
      modelName: options.modelName
    } );

    const baseCompressor = LLMChainExtractor.fromLLM( chatModel );

    // get the supported text splitter languages
    console.log( SupportedTextSplitterLanguages ); // Array of supported languages

    const splitter = RecursiveCharacterTextSplitter.fromLanguage( 'markdown', {
      chunkSize: 128,
      chunkOverlap: 25
    } );

    // Create documents from the training documents.
    const documents = await splitter.createDocuments( trainingDocuments );

    // Create a vector store from the documents.
    const vectorStore = await HNSWLib.fromDocuments( documents, new OpenAIEmbeddings() );

    // Set up a retreiver that will only include the relevant portions of the documentation to include
    // in the query.
    const retriever = new ContextualCompressionRetriever( {
      baseCompressor,
      baseRetriever: vectorStore.asRetriever()
    } );
    const chain = RetrievalQAChain.fromLLM( chatModel, retriever );

    // const relevantDocuments = retriever.getRelevantDocuments( 'What code should I write to draw a circle using scenery?' );
    // console.log( relevantDocuments );

    const res = await chain.call( {
      query: prompt
    } );
    return res;
  }

  /**
   * Upload training documents for the model to use.
   * @param files
   * @return {Promise<void>}
   */
  static async uploadTrainingDocuments( files ) {

    console.log( files );

    // clear documents on a new upload
    trainingDocuments.length = 0;

    // Process the uploaded files
    files.forEach( file => {
      const fileContents = fs.readFileSync( file.path, 'utf-8' );
      trainingDocuments.push( fileContents );
    } );

    // delete the uploaded files after reading contents
    files.forEach( file => {
      fs.unlinkSync( file.path );
    } );
  }
}

module.exports = LangChainManager;