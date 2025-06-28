import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true,
  selector: 'app-insurance',
  imports: [CommonModule, FormsModule],
  templateUrl: './insurance.component.html',
  styleUrl: './insurance.component.css',
})
export class InsuranceComponent {
  cropPremiumMap: { [key: string]: number } = {};
  selectedCrop = '';
  enteredPremium = 0;
  landArea = 0;
  extraAmount = 0;

  premiumPerAcre = 0;
  totalAmount = 0;

  selectedCalcCrop = '';

  cropList: string[] = ['सोयाबीन', 'तूर', 'कापूस', 'मूग', 'उडीद'];

  landAreas: { [key: string]: number } = {};
  cropAmounts: { [key: string]: number } = {};
  finalTotal = 0;

  constructor(private toastr: ToastrService) {}

  ngOnInit(): void {
    const saved = localStorage.getItem('cropPremiumMap');
    if (saved) {
      this.cropPremiumMap = JSON.parse(saved);
    } else {
      this.cropPremiumMap = {};
      localStorage.setItem(
        'cropPremiumMap',
        JSON.stringify(this.cropPremiumMap)
      );
    }
  }

  getCropList(): string[] {
    return this.cropList;
  }

  setPremiumForCrop() {
    if (
      !this.selectedCrop ||
      this.enteredPremium == null ||
      this.enteredPremium <= 0
    ) {
      this.toastr.warning(
        'कृपया पीक निवडा आणि योग्य (धनात्मक) विमा रक्कम भरा',
        'सूचना'
      );
      return;
    }
    if (this.enteredPremium < 0) {
      this.toastr.error(
        'विमा रक्कम ऋणात्मक (negative) असू शकत नाही.',
        'त्रुटी'
      );
      return;
    }
    this.cropPremiumMap[this.selectedCrop] = this.enteredPremium;
    localStorage.setItem('cropPremiumMap', JSON.stringify(this.cropPremiumMap));
    this.toastr.success(
      `₹${this.enteredPremium} विमा रक्कम ${this.selectedCrop} साठी जतन केली आहे`,
      'यशस्वी'
    );
    this.enteredPremium = null as any;
    this.selectedCrop = '';
  }

  calculatePremium() {
    if (this.landArea < 0 || this.extraAmount < 0) {
      this.toastr.error(
        'कृपया सकारात्मक (positive) क्षेत्रफळ आणि अतिरिक्त रक्कम भरा.',
        'त्रुटी'
      );
      return;
    }
    const premiumFor2_5Acre = this.cropPremiumMap[this.selectedCalcCrop];
    if (!this.selectedCalcCrop) {
      this.toastr.warning('कृपया पीक निवडा.', 'सूचना');
      return;
    }
    if (premiumFor2_5Acre == null || premiumFor2_5Acre <= 0) {
      this.toastr.error(
        'हे पीक सेव्ह केलेली पिके व विमा रक्कम यादीत नाही. कृपया प्रथम ते सेव्ह करा.',
        'त्रुटी'
      );
      return;
    }
    if (this.landArea <= 0) {
      this.toastr.warning('कृपया योग्य क्षेत्रफळ भरा.', 'सूचना');
      return;
    }
    // 1 हेक्टर = 2.5 एकर, म्हणून 2.5 एकर साठीची रक्कम 1 हेक्टर साठी लागू करा
    this.premiumPerAcre = premiumFor2_5Acre; // 2.5 एकर साठी रक्कम
    const base = this.premiumPerAcre * this.landArea; // landArea आता हेक्टर मध्ये
    this.totalAmount = Math.round(base + this.extraAmount);
  }

  calculateAllCrops() {
    this.cropAmounts = {};
    let sum = 0;
    for (const crop of this.getCropList()) {
      const area = this.landAreas[crop] || 0;
      const premium = this.cropPremiumMap[crop] || 0;
      if (area > 0 && premium > 0) {
        const amt = premium * area;
        this.cropAmounts[crop] = amt;
        sum += amt;
      } else {
        this.cropAmounts[crop] = 0;
      }
    }
    this.finalTotal = Math.round(sum + (this.extraAmount || 0));
  }

  getSavedCrops(): { crop: string; premium: number }[] {
    return Object.entries(this.cropPremiumMap).map(([crop, premium]) => ({
      crop,
      premium,
    }));
  }

  removeCrop(crop: string) {
    delete this.cropPremiumMap[crop];
    localStorage.setItem('cropPremiumMap', JSON.stringify(this.cropPremiumMap));
  }

  showPremiumInput(): boolean {
    return this.getCropList().some((crop) => !(crop in this.cropPremiumMap));
  }

  resetAllCrops() {
    for (const crop of this.getCropList()) {
      this.landAreas[crop] = 0;
      this.cropAmounts[crop] = 0;
    }
    this.extraAmount = 0;
    this.finalTotal = 0;
  }
}

// -----------------------------
// © 2025 Ashish Mane. All rights reserved.
// -----------------------------
