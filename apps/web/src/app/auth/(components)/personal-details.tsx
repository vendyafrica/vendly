"use client";
import React from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

const PersonalDetailsForm = () => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input id="fullName" placeholder="John Doe" />
      </div>
      <div>
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <div className="flex">
          <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
            +254
          </span>
          <Input id="phoneNumber" placeholder="712 345 678" />
        </div>
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" />
      </div>
      <Button>Continue</Button>
    </div>
  );
};

export default PersonalDetailsForm;