"use client"
import EditApp from "@/components/edit-app-component";
import DeleteApp from "@/components/delete-app.component";
import { useState, useEffect } from "react";
import { useSession } from "@/components/providers/session-provider";
import { useApplications } from "@/components/providers/applications-provider";
import {calculatePasswordScore as score, calculatePasswordStrength as strength, getAgeInDays as age} from "@/lib/utils";
import PopApp from "@/components/ui/pop-app-component";

const PasswordRow = ({application,passwords}) => {
  const permissions = useSession().session.user.permissions || [];
  const passwordAge = age(application.updatedAt);
  const passwordStrength = strength(application.password,passwordAge,passwords);
  const passwordScore = score(application.password);
  return (
    <tr className="[&>td]:p-2 border bg-secondary">
      <td>
        <div className="flex items-center gap-2">
          <img src={application.logo} className="h-10 w-10 object-cover rounded hidden md:block"/>
          <>{application.name}<br/>{application.address}</>
        </div>
      </td>
      <td>
        {passwordScore}%
        <div className="bg-background h-3 w-full rounded-xl">
          <div className={`h-full rounded-xl ${passwordScore <= 20 ? "bg-red-500 w-1/5" : passwordScore <= 40 ? "bg-red-500 w-2/5" : passwordScore <= 60 ? "bg-yellow-500 w-3/5" : passwordScore <= 80 ? "bg-yellow-500 w-4/5" : passwordScore <= 90 ? "bg-green-500 w-11/12" : "w-full"}`}></div>
        </div>
      </td>
      <td>{passwordAge} days</td>
      <td>{passwordStrength}</td>
      <td>
        <div className="flex gap-2">
          <PopApp application={application}/>
          <EditApp application={application}/>
          <DeleteApp application={application}/>
        </div>
    </td>
    </tr>
  )
}

const PasswordsPage = () => {

  const applications = useApplications().applications.data;
  const [passwords, setPasswords] = useState([]);
  useEffect(() => {
    setPasswords(applications);
  }, [applications])

  return (
    <div className="max-h-full flex flex-col gap-9">
      <h1>Mots de passe</h1>
      <table className="w-full border">
        <thead>
          <tr className="[&>th]:p-2 border [&>th]:text-start">
            <th>Nom</th>
            <th>Force du mot de passe</th>
            <th>Ancienneté du mot de passe</th>
            <th>Niveau de sécurité</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications && applications.map((application) => (
            <PasswordRow key={application.id} application={application} passwords={passwords}/>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PasswordsPage
