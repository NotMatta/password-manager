"use client"
import AddApp from "@/components/add-app-component";
import EditApp from "@/components/edit-app-component";
import DeleteApp from "@/components/delete-app.component";
import { useApplications } from "@/components/providers/applications-provider";
import { getAgeInDays as age, formatISODate as date } from "@/lib/utils";
import { useEffect } from "react";

const AppsPage = () => {

  const applications = useApplications().applications.data;
  useEffect(() => {
    console.log("Applications loaded",applications);
  }, [applications])

  return (
    <div className="gap-2 flex flex-col h-full max-h-full">
      <div className="flex justify-between">
        <h1>Applications</h1>
        <AddApp/>
      </div>
      <div className="w-full overflow-scroll grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2">
        {applications && applications.map((application) => (
          <div key={application.id} className="p-4 border rounded-xl flex flex-col justify-between aspect-square">
            <h2 className="line-clamp-1 text-2xl flex gap-2 items-center"><img src={application.logo} className="h-12 w-12"/>{application.name}</h2>
            <div className="flex-grow text-sm">
              <h4>{application.address}/{application.login}</h4>
              <p>Created at {date(application.createdAt)}<br/>
              Last Updated {age(application.updatedAt)} days ago</p>
            </div>
            <div className="flex gap-2 justify-end">
              <EditApp application={application}/>
              <DeleteApp application={application}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AppsPage
