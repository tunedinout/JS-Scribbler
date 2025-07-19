// NOTE: GENERAL format of error response handling
// will help us by checking the res.message for errors

import { API_HOST, endpoints } from './constants'
import { axiosRetry, fetchRetry, getLogger } from './util'
import axios from 'axios'

// and handle that directly in the calling code
const logger = getLogger(`API.JS`)

export async function getAuthURL() {
    try {
        const response = await fetch(`${API_HOST}/${endpoints.auth}`, {
            method: 'GET',
            headers: {
                // TODO: do we need this
                'Access-Control-Allow-Origin': '*',
            },
        })
        const authObj = await response.json()
        return authObj
    } catch ({ response }) {
        // TODO: carefully evaluate why we do this
        return {
            message:
                response?.data?.message ||
                response?.data ||
                'Unable to get AUTH url',
            ...response,
        }
    }
}


export async function createDriveFolder() {
    const log = logger(`createDriveFolder`)
    try {
        const response = await axios({
            url: `${API_HOST}/${endpoints.drive}`,
            method: 'POST',
            withCredentials: true,
        })

        return response
    } catch ({ response }) {
        // TODO: carefully evaluate why we do this
        console.log(`error response while creating app folder`, response)
        return {
            message:
                response?.data?.message ||
                response?.data ||
                'Unable to create app folder.',
            ...response,
        }
    }
}

/**
 *
 * @param {String} accessToken
 * @param {String} driveFolderId
 * @returns an array of {id,name} - of existing scribbles
 */
export async function fetchScribbles(
    driveFolderId
) {
    const log = logger(`fetchScribbles`);
    try {
        const response = await axios({
            url: `${API_HOST}/${endpoints.scribbles}?driveFolderId=${driveFolderId}`,
            method: 'GET',
            withCredentials: true,
        })
        return response
    } catch ({ response }) {
        log(`response`, response)
        return {
            message:
                response?.data?.message ||
                response?.data ||
                'Unable to get existing scribbles.',
            ...response,
        }
    }
}

/**
 *
 * @param {String} accessToken
 * @param {String} scribbleId
 * @returns an array of {mimeType,id,data} - of each css, js and html file
 */
export async function fetchScribble( scribbleId) {
    try {
        const response = await axios({
            url: `${API_HOST}/${endpoints.scribbles}/${scribbleId}`,
            method: 'GET',
            withCredentials: true,
        })
        return response
    } catch ({ response }) {
        return {
            message:
                response?.data?.message ||
                response?.data ||
                'Unable to get existing scribbles.',
            ...response,
        }
    }
}


export async function createScribble(
    driveFolderId,
    {
        name = '', js = '', css = '', html = ''
    }
) {
    try {
        const response = await axios({
            url: `${API_HOST}/${endpoints.scribbles}`,
            method: 'POST',
            withCredentials: true,
            data: {
                driveFolderId,
                name,
                js,
                css,
                html,
            },
        })

        return response
    } catch (error) {
        // throw this error since this method will be used for both 
        // creating individual scribbler and bulk 
        // we loet the calling code decide
        throw error;
    }
}


export async function updateScribble({
    id: scribbleId,
    js,
    css,
    html,
}) {
    const log = logger(`updateScribble`)
    try {
        const response = await axios({
            url: `${API_HOST}/${endpoints.scribbles}/${scribbleId}`,
            method: 'PUT',
            withCredentials: true,
            data: {
                scribbleId,
                js,
                css,
                html,
            },
        })
        log(`response`, response)

        return response
    } catch ({ response }) {
        return {
            message:
                response?.data?.message ||
                response?.data ||
                `unable to update scribble with id ${scribbleId}`,
            ...response,
        }
    }
}

export async function fetchMe(signal) {
    const response =  axios.get(`${API_HOST}/${endpoints.me}`, {signal, withCredentials: true})
    return response
}

export async function getLLMOpinion(code) {
    const content = `
        User is testing small snippets of js,css and html code for testing and prototypeing.
        Your answer should only comment on the code about: 
        1. what they are acheiving with that snippet
        2. Check the concepts what they are applying and tell them that.
        3. do not give improvement on structuring the code but only improvements in understanding the core
        concept they implement. So no code reading improvement, no semantics improvement, no accessibility only 
        comment on js,css and html concepts. The users goal is not to produce a industry code but hack around with core 
        web concepts. 

        Your answer should be in an html format right from the start as your ans will directly go into a react component. you would not 
        mention anything out of this prompt other then just giving your answer based on above points and only about the js, css and html code. Format it well. 

        Please do not add any started phrases or anything directly go to answering. You have no personality other than give code feedback. 

        ALWAYS HTML, your answer will be rendered inside a  <div> element, you are free to choose any child elements for formatting, please format it real nice. You can also demonstrate thing using html if you want.. 
        ALWAYS HTML, your answer will be rendered inside a <div> element, the whole answer in a div . 

        DONT ADD things like "Here is my answer or reflect back on this prompt in the ans" please.

        HERE is there code object: 

        ${code}
    `

    const content1 = `
    ${code}.
      ( I want you to give your answer, entire answer in html right from the first word to the last word.
         Your ans will be rendered inside a div element, please do not add background colors. )

    `

    
    const log = logger(`getLLLMOpinion`)
    // try {
        const response = await axios({
            url: 'http://localhost:11434/v1/chat/completions',
            method: 'POST',
            data:{
                model: 'llama3',
                messages: [{role: "user", content: content1}]
            }
        })
        // const firstAIRespoonse = response.data?.choices[0]?.message?.content
        log(`LLM opinion arrived`, response);
        return response
    // } catch (error) {
    //     log(`error occurred while asking LLM: `, error)
    //     return ''
    // }
}