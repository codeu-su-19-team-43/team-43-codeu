package com.google.codeu.data;

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
}