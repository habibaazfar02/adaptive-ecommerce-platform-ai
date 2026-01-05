package com.ecommerce.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name="products")
public class Product {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;

  @Column(columnDefinition = "TEXT")
  private String description;

  @Column(name="base_price", nullable=false)
  private BigDecimal basePrice;

  @Column(name="current_price", nullable=false)
  private BigDecimal currentPrice;

  private int stock;
  private String category;
  private String tags;

  @Column(name="updated_at")
  private Instant updatedAt;

  // Product.java (Partial)
// Add this field inside your Product class
@Lob // Specifies that the property should be persisted as a large object
@Column(name = "image_url", columnDefinition = "LONGTEXT")
private String imageUrl;

// Add getter and setter
public String getImageUrl() { return imageUrl; }
public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

  // getters/setters
  public Long getId(){ return id; }
  public void setId(Long id){ this.id=id; }

  public String getName(){ return name; }
  public void setName(String name){ this.name=name; }

  public String getDescription(){ return description; }
  public void setDescription(String description){ this.description=description; }

  public BigDecimal getBasePrice(){ return basePrice; }
  public void setBasePrice(BigDecimal basePrice){ this.basePrice=basePrice; }

  public BigDecimal getCurrentPrice(){ return currentPrice; }
  public void setCurrentPrice(BigDecimal currentPrice){ this.currentPrice=currentPrice; }

  public int getStock(){ return stock; }
  public void setStock(int stock){ this.stock=stock; }

  public String getCategory(){ return category; }
  public void setCategory(String category){ this.category=category; }

  public String getTags(){ return tags; }
  public void setTags(String tags){ this.tags=tags; }

  public Instant getUpdatedAt(){ return updatedAt; }
  public void setUpdatedAt(Instant updatedAt){ this.updatedAt=updatedAt; }
}