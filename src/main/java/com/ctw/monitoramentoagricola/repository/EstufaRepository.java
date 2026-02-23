package com.ctw.monitoramentoagricola.repository;

import com.ctw.monitoramentoagricola.model.Estufa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EstufaRepository extends JpaRepository<Estufa,Long> {

    Optional<Estufa> findTopByOrderByIdDesc();

    @Query(value = "SELECT * FROM monitoramento_estufa ORDER BY id DESC LIMIT 20", nativeQuery = true)
    List<Estufa> findUltimosRegistros();
}
