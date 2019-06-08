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

import java.util.UUID;

/** A single message posted by a user. */
public class Message {

  private UUID id;
  private String user;
  private long timestamp;
  private String text;
  private String imageUrl;
  private String imageLabels;


  /**
   * Constructs a new {@link Message} posted by {@code user} with {@code text}. 
   * Generates a random ID and uses the current system 
   * time for the creation time.
   */
  public Message(String user, String text) {
    this(UUID.randomUUID(), user, System.currentTimeMillis(), text);
  }

  /**
   * Constructs a new {@link Message}.
   */
  public Message(UUID id, String user, long timestamp, String text) {
    this.id = id;
    this.user = user;
    this.timestamp = timestamp;
    this.text = text;
  }

  /**
   * Constructs a new {@link Message}.
   */
  public Message(UUID id, String user, long timestamp, String text, String imageUrl, 
                 String imageLabels) {
    this.id = id;
    this.user = user;
    this.timestamp = timestamp;
    this.text = text;
    this.imageUrl = imageUrl;
    this.imageLabels = imageLabels;
  }

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public String getUser() {
    return user;
  }

  public void setUser(String user) {
    this.user = user;
  }

  public long getTimestamp() {
    return timestamp;
  }

  public void setTimestamp(long timestamp) {
    this.timestamp = timestamp;
  }

  public String getText() {
    return text;
  }

  public void setText(String text) {
    this.text = text;
  }

  public String getImageUrl() {
    return imageUrl;
  }

  public void setImageUrl(String imageUrl) {
    this.imageUrl = imageUrl;
  }

  public String getImageLabels() {
    return imageLabels;
  }

  public void setImageLabels(String imageLabels) {
    this.imageLabels = imageLabels;
  }
}
