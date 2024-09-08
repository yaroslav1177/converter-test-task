import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../../services/currency.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-currency-converter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.scss']
})
export class CurrencyConverterComponent implements OnInit {
  currencies: string[] = ['UAH', 'USD', 'EUR', 'GBP'];

  initialCurrency1: string = 'UAH';
  initialCurrency2: string = 'USD';
  initialAmount1: number | null = null;
  initialAmount2: number | null = null;

  amount1: number | null = null;
  amount2: number | null = null;
  currency1: string = 'UAH';
  currency2: string = 'USD';

  exchangeRates: { [key: string]: number } = {};

  constructor(private currencyService: CurrencyService) {}

  ngOnInit() {
    this.loadExchangeRates();
    this.resetToInitialValues();
  }

  loadExchangeRates() {
    this.currencyService.getRates().subscribe(data => {
      this.processExchangeRates(data);
      this.convertCurrency();
    });
  }

  processExchangeRates(data: any) {
    this.exchangeRates = {};
    data.forEach((item: any) => {
      const code = item.cc;
      const rate = item.rate;
      this.exchangeRates[code] = rate;
    });
  }

  convertCurrency() {
    if (this.currency1 && this.currency2) {
      if (this.amount1 !== null) {
        this.convertAmount1();
      } else if (this.amount2 !== null) {
        this.convertAmount2();
      } else {
        this.resetAmounts();
      }
    }
  }

  convertAmount1() {
    const rate1toUAH = this.currency1 === 'UAH' ? 1 : this.exchangeRates[this.currency1];
    const rate2toUAH = this.currency2 === 'UAH' ? 1 : this.exchangeRates[this.currency2];

    this.amount2 = parseFloat((this.amount1! * (rate1toUAH / rate2toUAH)).toFixed(2));
  }

  convertAmount2() {
    const rate2toUAH = this.currency2 === 'UAH' ? 1 : this.exchangeRates[this.currency2];
    const rate1toUAH = this.currency1 === 'UAH' ? 1 : this.exchangeRates[this.currency1];

    this.amount1 = parseFloat((this.amount2! * (rate2toUAH / rate1toUAH)).toFixed(2));
  }

  onAmount1Change() {
    if (this.amount1 === null || this.amount1 === 0) {
      this.resetAmounts();
    } else {
      this.convertAmount1();
    }
  }

  onAmount2Change() {
    if (this.amount2 === null || this.amount2 === 0) {
      this.resetAmounts();
    } else {
      this.convertAmount2();
    }
  }

  onCurrencyChange() {
    this.convertCurrency();
  }

  resetAmounts() {
    this.amount1 = null;
    this.amount2 = null;
  }

  resetToInitialValues() {
    this.currency1 = this.initialCurrency1;
    this.currency2 = this.initialCurrency2;
    this.amount1 = this.initialAmount1;
    this.amount2 = this.initialAmount2;
    this.convertCurrency();
  }
}
