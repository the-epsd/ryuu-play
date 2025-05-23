import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Card } from '@ptcg/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

import { CardImagePopupComponent } from './card-image-popup.component';

describe('CardImagePopupComponent', () => {
  let component: CardImagePopupComponent;
  let fixture: ComponentFixture<CardImagePopupComponent>;
  let data: { card: Card, facedown: boolean };

  beforeEach(waitForAsync(() => {
    data = { card: null, facedown: false };

    TestBed.configureTestingModule({
      declarations: [ CardImagePopupComponent ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: data }
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardImagePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
