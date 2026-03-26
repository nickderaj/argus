package com.argus.repository;

import com.argus.entity.StepDefinition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StepDefinitionRepository extends JpaRepository<StepDefinition, Long> {

    Optional<StepDefinition> findByKeywordAndText(String keyword, String text);

    @Query("SELECT sd FROM StepDefinition sd WHERE LOWER(sd.text) LIKE LOWER(CONCAT('%', :query, '%')) ORDER BY sd.text")
    List<StepDefinition> searchByText(@Param("query") String query);

    @Query("SELECT sd FROM StepDefinition sd WHERE sd.keyword = :keyword AND LOWER(sd.text) LIKE LOWER(CONCAT('%', :query, '%')) ORDER BY sd.text")
    List<StepDefinition> searchByTextAndKeyword(@Param("query") String query, @Param("keyword") String keyword);
}
