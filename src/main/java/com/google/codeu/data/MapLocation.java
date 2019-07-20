package com.google.codeu.data;

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
public class MapLocation {

  private String location;
  private double lat;
  private double lng;
  private List<UUID> messageIds;

  /**
   * Constructs a new {@link MapLocation}
   * Generates a random ID
   */
  public MapLocation(String location, double lat, double lng) {
    this.location = location;
    this.lat = lat;
    this.lng = lng;
  }

}
