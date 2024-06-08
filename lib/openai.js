import OpenAI from 'openai';

const openai = new OpenAI();

const summarizer = await openai.beta.assistants.create({
    model: 'gpt-3.5-turbo-16k',
    name: 'Journal Summarizer',
    instructions: 'When responding, give it in the form of a JSON array without any context. Each array should have a name and the activity they did together. The array should look something like this: [ { "name": "Joe", "description": "Played badminton together"}, {"name": "George", "description": "Played badminton"} ] Dont need to give any information about the user just the people and the activities they did with each person. Each person just gets one element with name and description and there shouldnt be any elements with them together. In addition, include the date of the interaction in the description as well as be specific with the feeling of the person during the interaction',
});
const summarizerId = summarizer.id;

const descriptor = await openai.beta.assistants.create({
    model: 'gpt-3.5-turbo-16k',
    name: 'Description Expander',
    instructions: 'You will be given a description of activites two people did together. The user is someone with dementia and you will be given the name of the person they did they activies with as well as the activity and date, please elaborate on the activity and focus on feel without giving untruthful information. Talk in second person and keep it brief.',
});
const descriptorId = descriptor.id;

export const getSummarizerResponse = async (prompt) => {
    const thread = await openai.beta.threads.create({
        messages: [
            {
                role: 'user',
                content: prompt,
            },
        ],
    });

    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
        assistant_id: summarizerId
    });

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

    if (run.status == 'completed') {
        const messages = await openai.beta.threads.messages.list(thread.id);
        return messages
    } else {
        return null;
    }
}

