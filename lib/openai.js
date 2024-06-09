import OpenAI from 'openai';

const openai = new OpenAI();

const summarizer = await openai.beta.assistants.create({
    model: 'gpt-4-turbo-preview',
    name: 'Journal Summarizer',
    instructions: 'When responding, give it in the form of a JSON array without any context. Each array should have a name and the activity they did together. The array should look something like this: [ { "name": "Joe", "description": "Played badminton together"}, {"name": "George", "description": "Played badminton"} ] Dont need to give any information about the user just the people and the activities they did with each person. Each person just gets one element with name and description and there shouldnt be any elements with them together or of assistant and user. In addition, include the date of the interaction in the description as well as be specific with the feeling of the person during the interaction. The name will always be full name. If an image is attached with a description, add the description of the image as well. If the image description is mentioned but doesnt have anything following it then just ignore it.',
});
const summarizerId = summarizer.id;

const descriptor = await openai.beta.assistants.create({
    model: 'gpt-3.5-turbo-16k',
    name: 'Description Expander',
    instructions: 'You will be given a description of activites two people did together. The user is someone with dementia and you will be given the name of the person they did they activies with as well as the activity and date, please elaborate on the activity without giving untruthful information. Talk in second person and keep it brief.',
});
const descriptorId = descriptor.id;

export const getSummarizerResponse = async (prompt) => {
    const thread = await openai.beta.threads.create({
        messages: [
            {
                role: 'user',
                content: prompt,
            },
        ]
    });

    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
        assistant_id: summarizerId
    });
    console.log(run);
    if (run.status == 'completed') {
        const messages = await openai.beta.threads.messages.list(thread.id);
        return messages
    } else {
        return null;
    }
}

export const getDescriptorResponse = async (prompt) => {
    const thread = await openai.beta.threads.create({
        messages: [
            {
                role: 'user',
                content: prompt,
            },
        ],
    });

    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
        assistant_id: descriptorId
    });
    console.log(run);
    if (run.status == 'completed') {
        const messages = await openai.beta.threads.messages.list(thread.id);
        return messages
    } else {
        return null;
    }
}

export const speak = async (prompt) => {
    const mp3 = await openai.audio.speech.create({
        model: "tts-1-hd",
        voice: "echo",
        input: prompt,
    });
    const buffer = Buffer.from(await mp3.arrayBuffer());
    return buffer;
}

export const imagizer = async (prompt) => {
    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: 'system', content: "What is this image" },
            {
                role: 'user', content: [
                    {
                        type: "image_url",
                        image_url:
                        {
                            "url": "data:image/png;base64," + prompt
                        }
                    }
                ]
            },
        ],
        max_tokens: 300,
    });
    return response.choices[0].message.content;
}