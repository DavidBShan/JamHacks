import OpenAI from 'openai';

const openai = new OpenAI();

const summarizer = await openai.beta.assistants.create({
    model: 'gpt-3.5-turbo-16k',
    name: 'Journal Summarizer',
    instructions: 'When responding, give it in the form of a JSON array without any context. Each array should have a name and the activity they did together. The array should look something like this: [ { "name": "Joe", "description": "Played badminton together"}, {"name": "George", "description": "Played badminton"} ] Dont need to give any information about the user just the people and the activities they did with each person.',
});
const summarizerId = summarizer.id;

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

