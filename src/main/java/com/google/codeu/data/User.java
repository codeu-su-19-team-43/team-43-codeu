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
  private List<UUID> favouriteMessages;

  public User(String email, String username, String location, String organization,
              String website, String aboutMe, String profileImageUrl) {
    this(email, username, location, organization, website, aboutMe, profileImageUrl,
            new ArrayList<>());
  }

  /**
   * Converts list of favourite IDs as strings to list of favourite IDs as UUIDs.
   */
  public List<UUID> convertStringsToFavouriteIds(List<String> favouriteIdsAsStrings) {
    if (favouriteIdsAsStrings == null) {
      return new ArrayList<>();
    }

    List<UUID> favouriteIds = new ArrayList<>();
    for (String favouriteIdAsString: favouriteIdsAsStrings) {
      favouriteIds.add(UUID.fromString(favouriteIdAsString));
    }

    return favouriteIds;
  }

  /**
   * Converts list of favourite IDs as UUIDs to list of favourite IDs as strings.
   */
  public List<String> convertfavouriteIdsToStrings(List<UUID> favouriteIds) {
    if (favouriteIds == null) {
      return new ArrayList<>();
    }

    List<String> favouriteIdsAsStrings = new ArrayList<>();
    for (UUID favouriteId: favouriteIds) {
      favouriteIdsAsStrings.add(favouriteId.toString());
    }

    return favouriteIdsAsStrings;
  }
}