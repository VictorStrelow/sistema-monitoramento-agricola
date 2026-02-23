package com.ctw.monitoramentoagricola.controller;

import com.ctw.monitoramentoagricola.dto.EstufaDTO;
import com.ctw.monitoramentoagricola.service.EstufaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/estufa")
@CrossOrigin(origins = "*")
public class EstufaController {

    @Autowired
    private EstufaService service;

    @GetMapping("/atual")
    public EstufaDTO getAtual() {
        return service.getUltimaLeitura();
    }

    @GetMapping("/historico")
    public List<EstufaDTO> getHistorico() {
        return service.getHistorico();
    }
}
