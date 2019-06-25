/*
 * Copyright 2019 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.google.codeu.data;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.SortDirection;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

/**
 * Provides access to the data stored in Datastore.
 */
public class Datastore {

  private DatastoreService datastore;

  public Datastore() {
    datastore = DatastoreServiceFactory.getDatastoreService();
  }

  /**
   * Stores the Message in Datastore.
   */
  public void storeMessage(Message message) {
    Entity messageEntity = new Entity("Message", message.getId().toString());
    messageEntity.setProperty("user", message.getUser());
    messageEntity.setProperty("text", message.getText());
    messageEntity.setProperty("timestamp", message.getTimestamp());
    messageEntity.setProperty("imageUrl", message.getImageUrl());
    messageEntity.setProperty("imageLabels", message.getImageLabels());
    messageEntity.setProperty("imageLandmark", message.getImageLandmark());
    messageEntity.setProperty("imageLat", message.getImageLat());
    messageEntity.setProperty("imageLong", message.getImageLong());
    messageEntity.setProperty("sentimentScore", message.getSentimentScore());
    messageEntity.setProperty("commentIdsAsStrings",
            message.convertCommentIdsToStrings(message.getCommentIds()));
    datastore.put(messageEntity);
  }

  /**
   * Gets {@link Message} using {@param messageId}.
   *
   * @return a message with given id, or throws an exception.
   */
  public Message getMessage(String messageId) throws Exception {
    Entity entity = datastore.get(KeyFactory.createKey("Message", messageId));
    return convertMessageFromEntity(entity);
  }

  /**
   * Gets messages posted by a specific user.
   *
   * @return a list of messages posted by the user, or empty list if user has never posted a
   *     message. List is sorted by time descending.
   */
  public List<Message> getUserMessages(String user) {
    Query query =
        new Query("Message")
            .setFilter(new Query.FilterPredicate("user", FilterOperator.EQUAL, user))
            .addSort("timestamp", SortDirection.DESCENDING);
    PreparedQuery results = datastore.prepare(query);

    return convertMessagesFromQuery(results);
  }

  /**
   * Returns all messages for all users.
   */
  public List<Message> getAllMessages() {
    Query query = new Query("Message")
        .addSort("timestamp", SortDirection.DESCENDING);
    PreparedQuery results = datastore.prepare(query);

    return convertMessagesFromQuery(results);
  }

  /**
   * Converts query to messages.
   */
  public List<Message> convertMessagesFromQuery(PreparedQuery results) {
    List<Message> messages = new ArrayList<>();

    for (Entity entity : results.asIterable()) {
      try {
        Message message = convertMessageFromEntity(entity);
        messages.add(message);
      } catch (Exception e) {
        System.err.println("Error reading message.");
        System.err.println(entity.toString());
        e.printStackTrace();
      }
    }
    return messages;
  }

  /**
   * Converts message entity to {@link Message}.
   */
  public Message convertMessageFromEntity(Entity entity) throws Exception {
    String idString = entity.getKey().getName();
    UUID id = UUID.fromString(idString);
    String user = (String) entity.getProperty("user");
    long timestamp = (long) entity.getProperty("timestamp");
    String text = (String) entity.getProperty("text");
    Message message = new Message(id, user, timestamp, text);

    if (entity.hasProperty("imageUrl")) {
      message.setImageUrl((String) entity.getProperty("imageUrl"));
    }

    if (entity.hasProperty("imageLabels")) {
      message.setImageLabels((List<String>) entity.getProperty("imageLabels"));
    }

    if (entity.hasProperty("imageLandmark")) {
      message.setImageLandmark((String) entity.getProperty("imageLandmark"));
    }

    if (entity.hasProperty("imageLat")) {
      message.setImageLat((double) entity.getProperty("imageLat"));
    }

    if (entity.hasProperty("imageLong")) {
      message.setImageLong((double) entity.getProperty("imageLong"));
    }

    if (entity.hasProperty("sentimentScore")) {
      message.setSentimentScore((double) entity.getProperty("sentimentScore"));
    }

    if (entity.hasProperty("commentIdsAsStrings")) {
      message.setCommentIds(message.convertStringsToCommentIds(
              (List<String>) entity.getProperty("commentIdsAsStrings")
      ));
    }

    return message;
  }

  /**
   * Returns the total number of messages for all users.
   */
  public int getTotalMessageCount() {
    Query query = new Query("Message");
    PreparedQuery results = datastore.prepare(query);
    return results.countEntities(FetchOptions.Builder.withLimit(1000));
  }

  /**
   * Adds comment ID to message's commentIds with given {@param messageId}.
   */
  public void addCommentToMessage(String messageId, Comment comment) {
    try {
      // Add new comment ID to message.
      Message message = getMessage(messageId);
      List<UUID> commentIds = message.getCommentIds();

      if (commentIds == null) {
        commentIds = new ArrayList<>();
      }
      commentIds.add(comment.getId());
      message.setCommentIds(commentIds);
      storeMessage(message);

      // Store comment in Datastore.
      storeComment(comment);
    } catch (Exception e) {
      System.err.println("Error adding comment to message.");
      System.err.println(comment.toString());
      e.printStackTrace();
    }
  }

  /**
   * Stores the Comment in Datastore.
   */
  public void storeComment(Comment comment) {
    Entity commentEntity = new Entity("Comment", comment.getId().toString());
    commentEntity.setProperty("user", comment.getUser());
    commentEntity.setProperty("text", comment.getText());
    commentEntity.setProperty("timestamp", comment.getTimestamp());

    datastore.put(commentEntity);
  }

  /**
   * Gets comments posted on a specific message.
   *
   * @return a list of comments on a message, or empty list if there are no
   *     comments on the message.
   */
  public List<Comment> getCommentsForMessage(String messageId) {
    List<Comment> commentsForMessage = new ArrayList<>();

    try {
      Message message = getMessage(messageId);
      if (message.getCommentIds().size() == 0) {
        return commentsForMessage;
      }

      List<Key> keysForComments = new ArrayList<>();
      for (String commentId: message.convertCommentIdsToStrings(message.getCommentIds())) {
        keysForComments.add(KeyFactory.createKey("Comment", commentId));
      }

      Query query = new Query("Comment")
              .setFilter(new Query.FilterPredicate(
                      Entity.KEY_RESERVED_PROPERTY,
                      FilterOperator.IN,
                      keysForComments)
              );

      PreparedQuery results = datastore.prepare(query);
      commentsForMessage = convertCommentsFromQuery(results);
    } catch (Exception e) {
      System.err.println("Error getting comments for message.");
      e.printStackTrace();
    }

    return commentsForMessage;
  }

  /**
   * Convert query to comments.
   */
  public List<Comment> convertCommentsFromQuery(PreparedQuery results) {
    List<Comment> comments = new ArrayList<>();

    for (Entity entity: results.asIterable()) {
      try {
        Comment comment = convertCommentFromEntity(entity);
        comments.add(comment);
      } catch (Exception e) {
        System.err.println("Error reading comment.");
        System.err.println(entity.toString());
        e.printStackTrace();
      }
    }

    return comments;
  }

  /**
   * Converts message entity to {@link Comment}.
   */
  public Comment convertCommentFromEntity(Entity entity) {
    String commentIdString = entity.getKey().getName();
    UUID commentId = UUID.fromString(commentIdString);
    String user = (String) entity.getProperty("user");
    long timestamp = (long) entity.getProperty("timestamp");
    String text = (String) entity.getProperty("text");
    return new Comment(commentId, user, timestamp, text);
  }

  /**
   * Stores {@link User} in Datastore.
   */
  public void storeUser(User user) {
    Entity userEntity = new Entity("User", user.getEmail());
    userEntity.setProperty("email", user.getEmail());
    userEntity.setProperty("username", user.getUsername());
    userEntity.setProperty("location", user.getLocation());
    userEntity.setProperty("organization", user.getOrganization());
    userEntity.setProperty("website", user.getWebsite());
    userEntity.setProperty("aboutMe", user.getAboutMe());
    userEntity.setProperty("profileImageUrl", user.getProfileImageUrl());
    datastore.put(userEntity);
  }

  /** Returns the User owned by the email address,
   * or null if no matching User was found.
  */
  public User getUser(String email) {
    Query query = new Query("User")
        .setFilter(new Query.FilterPredicate("email", FilterOperator.EQUAL, email));
    PreparedQuery results = datastore.prepare(query);
    Entity userEntity = results.asSingleEntity();
    if (userEntity == null) {
      return null;
    }
    
    String aboutMe = (String) userEntity.getProperty("aboutMe");
    String username = (String) userEntity.getProperty("username");
    String profileImageUrl = (String) userEntity.getProperty("profileImageUrl");
    String location = (String) userEntity.getProperty("location");
    String organization = (String) userEntity.getProperty("organization");
    String website = (String) userEntity.getProperty("website");

    User user = new User(email, username, location, organization,
                         website, aboutMe, profileImageUrl);
    return user;
  }

  /** Returns all users. */
  public Set<String> getUsers() {
    Set<String> users = new HashSet<>();
    Query query = new Query("Message");
    PreparedQuery results = datastore.prepare(query);
    for (Entity entity: results.asIterable()) {
      users.add((String) entity.getProperty("user"));
    }
    return users;
  }
}
