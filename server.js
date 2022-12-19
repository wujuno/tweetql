import { ApolloServer, gql } from "apollo-server";

let tweets = [
    {
        id:"1",
        text:"first text",
        userId:"1"
    },
    {
        id:"2",
        text:"second text",
        userId:"2"
    }
];

let users = [
    {
        id: "1",
        firstName: "junho",
        lastName: "Lee"
    },
    {
        id: "2",
        firstName: "yusun",
        lastName: "Song"
    },

]


const typeDefs =gql`
    type User {
        id: ID!
        firstName: String!
        lastName: String!
        """
        Is the sum of firstName + lastName 
        """
        fullName: String!
    }
    type Tweet {
        id: ID!
        text: String!
        author: User
    }
    type Query {
        allUsers: [User!]!
        allTweets: [Tweet!]!
        tweet(id:ID): Tweet
    }
    type Mutation {
        postTweet(text:String!, userId: ID!): Tweet!
        deleteTweet(id:ID!): Boolean!
    } 
`;

const resolvers = {
    Query: {
        allTweets(){
            return tweets;
        },
        tweet(root,{id}){
            return tweets.find(tweet => tweet.id === id);
        },
        allUsers(){
            return users;
        }
    },
    Mutation: {
        postTweet(_,{text, userId}){
            if(users.find(user => user.id !== userId)) return false
            const newTweet = {
                id: tweets.length +1,
                text,
                userId,
            };
            tweets.push(newTweet);
            return newTweet
        },
        deleteTweet(_,{id}){
            const tweet = tweets.find(tweet => tweet.id ===id);
            if (!tweet) return false;
            tweets = tweets.filter(tweet => tweet.id !==id);
            return true;
        }
    },
    User: {
        fullName({firstName, lastName}){
            return `${lastName} ${firstName}`
        }
    },
    Tweet: {
        author({userId}) {
            return users.find(user => user.id === userId)
        }
    }
};


const server = new ApolloServer({typeDefs,resolvers});

server.listen().then(({url}) => {
    console.log(`Running on ${url}`);
})