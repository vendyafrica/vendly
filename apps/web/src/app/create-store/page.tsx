"use client";

import { useState } from "react";

import Layout from "./CreateStoreLayout";
import { CreateStoreForm } from "./(components)/create-store";
import { PersonalDetailsForm } from "./(components)/personal-details";
import { PaymentSetupForm } from "./(components)/payment-setup";

const steps = ["Store", "Personal Details", "Payment"];

export default function Page() {
  const [step, setStep] = useState(1);

  const next = () => setStep((s) => Math.min(s + 1, steps.length));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  let CurrentForm;
  if (step === 1) CurrentForm = <PersonalDetailsForm onNext={next} />;
  if (step === 2)
    CurrentForm = <CreateStoreForm onNext={next} onBack={back} />;
  if (step === 3) CurrentForm = <PaymentSetupForm onBack={back} />;

  return (
    <Layout step={step} steps={steps}>
      {CurrentForm}
    </Layout>
  );
}
