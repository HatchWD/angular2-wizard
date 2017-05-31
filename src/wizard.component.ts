import { Component, OnInit, Output, EventEmitter, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { WizardStepComponent } from './wizard-step.component';

@Component({
  selector: 'form-wizard',
  template:
  `<div class="card container">

    <div class="card-block">

      <ng-content></ng-content>
    </div>
    <div class="card-footer" [hidden]="isCompleted">
        <p id="js-button-prev" [ngClass]="{'card-footer__btn':true, 'float-left': true, hidden: !hasPrevStep || !activeStep.showPrev}" (click)="previous()">← Previous Step</p>
        <button id="js-button-next" type="button" [ngClass]="{'card-footer__btn':true, 'float-right': true, hidden: !hasNextStep || !activeStep.showNext}" (click)="next()" [disabled]="!activeStep.isValid" [hidden]="">Next</button>
        <!-- <button id="js-button-done" type="button" class="card-footer__btn float-right" (click)="complete()" [disabled]="!activeStep.isValid" [hidden]="hasNextStep || isMultiple">Compare →</button>
        <button id="js-button-done" type="button" class="card-footer__btn float-right" (click)="complete()" [disabled]="!activeStep.isValid" [hidden]="hasNextStep || !isMultiple">View Vacuum →</button> -->

    </div>
  </div>
  `
  ,
  styles: []
})
export class WizardComponent implements OnInit, AfterContentInit {
  @ContentChildren(WizardStepComponent)
  wizardSteps: QueryList<WizardStepComponent>;

  private _steps: Array<WizardStepComponent> = [];
  private _isCompleted: boolean = false;

  @Output()
  onStepChanged: EventEmitter<WizardStepComponent> = new EventEmitter<WizardStepComponent>();

  constructor() { }

  ngOnInit() {
  }

  ngAfterContentInit() {
    this.wizardSteps.forEach(step => this._steps.push(step));
    this.steps[0].isActive = true;
  }

  private get steps(): Array<WizardStepComponent> {
    return this._steps.filter(step => !step.hidden);
  }

  private get isCompleted(): boolean {
    return this._isCompleted;
  }

  private get activeStep(): WizardStepComponent {
    return this.steps.find(step => step.isActive);
  }

  private set activeStep(step: WizardStepComponent) {
    if (step !== this.activeStep && !step.isDisabled) {
      this.activeStep.isActive = false;
      step.isActive = true;
      this.onStepChanged.emit(step);
    }
  }

  private get activeStepIndex(): number {
    return this.steps.indexOf(this.activeStep);
  }

  private get hasNextStep(): boolean {
    return this.activeStepIndex < this.steps.length - 1;
  }

  private get hasPrevStep(): boolean {
    return this.activeStepIndex > 0;
  }

  goToStep(step: WizardStepComponent) {
    if (!this.isCompleted) {
      this.activeStep = step;
    }
  }

  next() {
    if (this.hasNextStep) {
      let nextStep: WizardStepComponent = this.steps[this.activeStepIndex + 1];
      this.activeStep.onNext.emit();
      nextStep.isDisabled = false;
      this.activeStep = nextStep;
    }
  }

  previous() {
    if (this.hasNextStep) {
      if (this.hasPrevStep) {
        let prevStep: WizardStepComponent = this.steps[this.activeStepIndex - 1];
        this.activeStep.onPrev.emit();
        prevStep.isDisabled = false;
        this.activeStep = prevStep;
      }
    }else{
      location.reload();
    }
  }

  complete() {
    this.activeStep.onComplete.emit();
    this._isCompleted = true;
  }

}
