My grandpa has dementia
He forgets a lot of memories and people but something he doesn't forget is me
As dementia develops you forget more and more people but some people you never forget
Those people can remind you of other people who remind you of other people, the closest people in our life open up doors to our most cherished memories
This isn't just my grandpa but countless people
We help you remember those memories by connecting memories to the people closest to you

So first can you load up website & journal? (Lucas does his thing. Focus on TinyMCE and how it can accept pictures and ask them to upload a picture. Show them the connection first to show them someone that they are't connected to)

Ultimately, we believe that by building a network of memories using the idea of association and connections to people can help my grandpa and people like him remember their most cherished memories that they journalled so they don't forget but still would unfortunately forget due to dementia. 

Show connections page (Show graph again and click the connections)

Tech Stack: Our entire app is built with NextJS and deployed on Vercel. The journalling page interacts with our graph database which is built with AuraDB which runs Neo4j. When understanding the journal, it calls an API call to GPT-4o to understand the image that is passed in and also the text. This data is then passed into the node's data. For the connections page, all of the database is visualized with vis.js and the user is determined via the auth0 Google Login Username. One of my favourite part of the project is the fact that two people on two accounts can journal about each other and both memories concatenate into one connection. 

Show NFC Tag (Built with dynamic routing so we can make this for any user)





