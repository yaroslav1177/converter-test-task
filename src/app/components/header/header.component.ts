import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../../services/currency.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  usdToUah!: number;
  eurToUah!: number;

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.currencyService.getRates().subscribe({
      next: (data) => {
        if (data) {
          const usd = data.find((rate: any) => rate.cc === 'USD');
          const eur = data.find((rate: any) => rate.cc === 'EUR');
          if (usd && eur) {
            this.usdToUah = usd.rate;
            this.eurToUah = eur.rate;
          }
        }
      },
    });
  }
}
