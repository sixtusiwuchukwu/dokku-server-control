const MESSAGE_SENT = "MESSAGE_SENT";

const PostQuery = {
  getPost: async (root, { data }, { datasources }) => {
    const { Post } = datasources;
    return await new Post().getPost();
  },
};

const PostMutaion = {
  addPost: async (root, { data }, { datasources, pubsub }) => {
    const { Post } = datasources;
    const newpost = await new Post().addPost(data);
    await pubsub.publish(MESSAGE_SENT, { newPost: newpost });
    return newpost;
  },
};

const PostSubscription = {
  newPost: {
    subscribe: async (root, args, { pubsub }) => {
      return await pubsub.asyncIterator(MESSAGE_SENT);
    },
  },
};

module.exports = { PostQuery, PostMutaion, PostSubscription };
