package com.ctw.monitoramentoagricola.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "monitoramento_estufa") // Certifique-se de que o nome da tabela no MySQL é este
public class Estufa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigDecimal temperatura;
    private BigDecimal umidade;
    private BigDecimal pressao;
    private Integer presenca;    // 0 ou 1
    private Integer distancia;   // em cm
    private Integer luminosidade;
    private Integer temp_solo;

    @Column(name = "data_hora")
    private LocalDateTime dataHora;

    public Estufa() {}

    public Estufa(Long id, BigDecimal temperatura, BigDecimal umidade, BigDecimal pressao, Integer presenca, Integer distancia, Integer luminosidade, Integer temp_solo, LocalDateTime dataHora) {
        this.id = id;
        this.temperatura = temperatura;
        this.umidade = umidade;
        this.pressao = pressao;
        this.presenca = presenca;
        this.distancia = distancia;
        this.luminosidade = luminosidade;
        this.temp_solo = temp_solo;
        this.dataHora = dataHora;
    }

    public Estufa(BigDecimal temperatura, BigDecimal umidade, BigDecimal pressao, Integer presenca, Integer distancia, Integer luminosidade, Integer temp_solo, LocalDateTime dataHora) {
        this.temperatura = temperatura;
        this.umidade = umidade;
        this.pressao = pressao;
        this.presenca = presenca;
        this.distancia = distancia;
        this.luminosidade = luminosidade;
        this.temp_solo = temp_solo;
        this.dataHora = dataHora;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getTemperatura() {
        return temperatura;
    }

    public void setTemperatura(BigDecimal temperatura) {
        this.temperatura = temperatura;
    }

    public BigDecimal getUmidade() {
        return umidade;
    }

    public void setUmidade(BigDecimal umidade) {
        this.umidade = umidade;
    }

    public BigDecimal getPressao() {
        return pressao;
    }

    public void setPressao(BigDecimal pressao) {
        this.pressao = pressao;
    }

    public Integer getPresenca() {
        return presenca;
    }

    public void setPresenca(Integer presenca) {
        this.presenca = presenca;
    }

    public Integer getDistancia() {
        return distancia;
    }

    public void setDistancia(Integer distancia) {
        this.distancia = distancia;
    }

    public Integer getLuminosidade() {
        return luminosidade;
    }

    public void setLuminosidade(Integer luminosidade) {
        this.luminosidade = luminosidade;
    }

    public Integer getTemp_solo() {
        return temp_solo;
    }

    public void setTemp_solo(Integer temp_solo) {
        this.temp_solo = temp_solo;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }
}
