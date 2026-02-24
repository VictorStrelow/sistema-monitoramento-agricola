package com.ctw.monitoramentoagricola.repository;

import com.ctw.monitoramentoagricola.model.Estufa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EstufaRepository extends JpaRepository<Estufa,Long> {

    @Query(value = "SELECT * FROM leitura_estufa ORDER BY id DESC LIMIT 1", nativeQuery = true)
    Optional<Estufa> findMelhorRegistroRecente();

    @Query(value = "SELECT * FROM leitura_estufa ORDER BY id DESC LIMIT 20", nativeQuery = true)
    List<Estufa> findUltimosRegistros();
}
