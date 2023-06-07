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

const chatModel = new ChatOpenAI( { openAIApiKey: process.env.OPENAI_API_KEY, temperature: 0.0 } );
// const model = new OpenAI( { openAIApiKey: process.env.OPENAI_API_KEY, temperature: 0.0 } );

const sceneryDoc = fs.readFileSync( './server/training-files/scenery-doc.md', 'utf8' );
const paperLandDoc = fs.readFileSync( './docs/use/board-api.md', 'utf8' );

class LangChainManager {
  constructor() {}

  /**
   * Test the connection by sending a simple chat message to OpenAI.
   * @return {Promise<*>}
   */
  static async connect() {
    const response = await chatModel.call( [
      new SystemChatMessage(
        'Checking OpenAI connection...'
      )
    ] );

    return response;
  }

  /**
   * Make a test query to the OpenAI API through LangChain.
   * @param {string} prompt - User prompt to forward after training.
   * @return {Promise<*>}
   */
  static async testQuery( prompt ) {

    const baseCompressor = LLMChainExtractor.fromLLM( chatModel );

    // get the supported text splitter languages
    // console.log( SupportedTextSplitterLanguages ); // Array of supported languages

    const splitter = RecursiveCharacterTextSplitter.fromLanguage( 'markdown', {
      chunkSize: 128,
      chunkOverlap: 25
    } );

    const documents = await splitter.createDocuments( [ sceneryDoc ] );

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
}

module.exports = LangChainManager;