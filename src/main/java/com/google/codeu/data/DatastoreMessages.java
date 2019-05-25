public List<Message> getAllMessages(){
  List<Message> messages = new ArrayList<>();

  Query query = new Query("Message")
    .addSort("timestamp", SortDirection.DESCENDING);
  PreparedQuery results = datastore.prepare(query);

  for (Entity entity : results.asIterable()) {
   try {
    String idString = entity.getKey().getName();
    UUID id = UUID.fromString(idString);
    String user = (String) entity.getProperty("user");
    String text = (String) entity.getProperty("text");
    long timestamp = (long) entity.getProperty("timestamp");

    Message message = new Message(id, user, text, timestamp);
    messages.add(message);
   } catch (Exception e) {
    System.err.println("Error reading message.");
    System.err.println(entity.toString());
    e.printStackTrace();
   }
  }

  return messages;
 }