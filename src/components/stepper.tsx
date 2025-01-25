import { cn } from '@/lib/utils';
import React, { useState } from 'react';

import { twMerge } from 'tailwind-merge';

export type Step = {
  index: number;
  active: boolean;
  complete: boolean;
  title: string;
};

export type StepperProps = {
  steps: Step[];
  goToStep: (value: number) => void;
};

export function useSteps(steps: Step[]) {
  const [internalSteps, setInternalSteps] = useState(steps);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  function handleGoToStep(stepIndex: number) {
    const newInternalSteps = internalSteps.map((step) => ({
      ...step,
      active: step.index === stepIndex,
      complete: step.index <= stepIndex
    }));

    setInternalSteps(newInternalSteps);
    setCurrentStepIndex(stepIndex);
  }

  function handleNextStep() {
    const currentStepIndex = internalSteps.findIndex((step) => step.active);

    if (currentStepIndex !== -1 && currentStepIndex < internalSteps.length - 1) {
      const newInternalSteps = [...internalSteps];
      newInternalSteps[currentStepIndex].active = false;
      newInternalSteps[currentStepIndex].complete = true;
      newInternalSteps[currentStepIndex + 1].active = true;

      setInternalSteps(newInternalSteps);
      setCurrentStepIndex(currentStepIndex + 1);
    }
  }

  function handlePrevStep() {
    const currentStepIndex = internalSteps.findIndex((step) => step.active);

    if (currentStepIndex > 0) {
      const newInternalSteps = [...internalSteps];
      newInternalSteps[currentStepIndex].active = false;
      newInternalSteps[currentStepIndex].complete = false;
      newInternalSteps[currentStepIndex - 1].active = true;

      setInternalSteps(newInternalSteps);
      setCurrentStepIndex(currentStepIndex - 1);
    }
  }

  return {
    stepsData: internalSteps,
    currentStepIndex,
    currentStep: internalSteps[currentStepIndex],
    nextStep: handleNextStep,
    prevStep: handlePrevStep,
    goToStep: handleGoToStep
  };
}

export function Stepper({ steps, goToStep }: StepperProps) {
  return (
    <div className="flex w-full justify-between">
      {steps.map((step, idx) => (
        <div className={`flex items-center ${idx < steps.length - 1 && 'flex-1'} `} key={idx}>
          <button
            className={cn(
              `border-border flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-medium disabled:cursor-not-allowed`,
              {
                '!bg-blue-500': step.active,
                '!bg-blue-500 hover:opacity-80': step.complete,
                'text-white': step.active || step.complete
              }
            )}
            onClick={() => {
              goToStep(idx);
            }}
            disabled={!step.complete}
          >
            <span>{idx + 1}</span>
            {/* <span className="hidden md:inline ml-1">{' - '.concat(step.title)}</span> */}
          </button>
          {idx < steps.length - 1 && (
            <div className={`relative mx-2 h-2 w-full rounded-[40px] bg-blue-100`}>
              <div
                className={`absolute h-full rounded-[40px] bg-blue-500 ${step.active && !step.complete ? 'w-[50%]' : step.complete ? 'w-full' : 'hidden'} `}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
