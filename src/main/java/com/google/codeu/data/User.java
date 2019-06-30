package com.google.codeu.data;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class User {
  private String email;
  private String username;
  private String location;
  private String organization;
  private String website;
  private String aboutMe;
  private String profileImageUrl;
  private List<UUID> favouriteMessageIds;

  public User(String email, String username, String location, String organization,
              String website, String aboutMe, String profileImageUrl) {
    this(email, username, location, organization, website, aboutMe, profileImageUrl,
            new ArrayList<>());
  }
}