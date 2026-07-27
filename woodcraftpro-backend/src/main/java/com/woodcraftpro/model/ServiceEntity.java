package com.woodcraftpro.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "services")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "service_name", nullable = false, length = 150)
    private String serviceName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "icon_name", length = 50)
    private String iconName = "Hammer";

    @Column(name = "image_url", length = 500)
    private String imageUrl;
}
