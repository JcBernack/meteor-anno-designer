Icons = new FS.Collection("icons", {
  stores: [
    new FS.Store.GridFS("icons")
  ],
  filter: {
    maxSize: 16384, // 16kb
    allow: {
      contentTypes: ['image/*'],
      extensions: ['png']
    }
  }
});
