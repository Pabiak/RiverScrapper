# AquaCrawler - pobieranie i obróbka danych o rzekach z IMGW

AquaCrawler to program służący do pobierania i analizowania danych hydrologicznych dotyczących polskich rzek z Instytutu Meteorologii i Gospodarki Wodnej (IMGW). Program pozwala na wykonywanie różnych analiz, w tym generowanie wykresów stanu wody, przepływu oraz krzywej natężenia przepływu. Dodatkowo, AquaCrawler umożliwia również obróbkę danych, takich jak wykrywanie i usuwanie wartości odstających, wyliczanie średniej wartości itp.

## Lista ToDo

- [ ] Pobieranie danych z IMGW
- [x] Pobranie wybranych rzek do osobnych plików
- [x] Wykresy stanu wody od daty
- [x] Wykresy przepływu od daty
- [x] Wykres krzywej natężenia przepływu
- [ ] Wykresy stanu wody dla dwóch stacji w półroczu zimowym (listopad - kwiecień)
- [ ] Wstawienie danych stanu wodu do templatki
- [ ] Wstawienie danych przepływów do templatki
- [ ] Usuwanie plików
## Wykresy

### Wykres stanu wody od daty

Wykres przedstawiający zmianę stanu wody dla wybranej stacji pomiarowej od wybranej daty. Na osi Y znajdują się wartości stanu wody, a na osi X daty pomiarów. 
![Wykres stanu wody od daty](./img/stanWody.png)

### Wykres przepływu od daty

Wykres przedstawiający zmianę przepływu dla wybranej stacji pomiarowej od wybranej daty. Na osi Y znajdują się wartości przepływu, a na osi X daty pomiarów.
![Wykres przepływu wody od daty](./img/przeplywWody.png)

### Krzywa natężenia przepływu

Wykres przedstawiający krzywą natężenia przepływu, czyli zależność między stanem wody a przepływem dla wybranej stacji pomiarowej. Na osi Y znajdują się wartości stanu wody, a na osi X wartości przepływu.
![Wykres przepływu wody od daty](./img/krzywaNatezenia.png)

### Wykresy stanu wody dla dwóch stacji w półroczu zimowym (listopad - kwiecień)

Wykres przedstawiający zmianę stanu wody dla dwóch wybranych stacji pomiarowych w półroczu zimowym (listopad - kwiecień). Na osi Y znajdują się wartości stanu wody, a na osi X daty pomiarów. Na jednym wykresie przedstawione są dane z dwóch stacji pomiarowych.
