"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button";
import { Plus, Eye, EyeOff } from "lucide-react";
import { Input } from "./ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { useApplications } from "./providers/applications-provider";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


const AddApp = () => {

  const {createApplication,mutationStatus,setMutationStatus} = useApplications()
  const [displayPassword,setDisplayPassword] = useState(false);
  const [res, setResponse] = useState("none");
  const [logo, setLogo] = useState("");
  const {toast} = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMutationStatus("loading")
    const formData = new FormData(e.target);
    if (!logo) formData.set("logo","https://cdn.icon-icons.com/icons2/2483/PNG/512/application_icon_149973.png")
    console.log(formData)
    createApplication.mutate(formData)
  }

  useEffect(() => {
    if(mutationStatus == "a_success"){
      setResponse("success")
      setMutationStatus("none")
    }
    if(mutationStatus == "a_error"){
      setResponse("error")
      setMutationStatus("none")
      toast({title:"Failed to add application",description:"An error occured while adding the application"})
    }
  },[mutationStatus,setMutationStatus,toast])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon"><Plus/></Button>
      </DialogTrigger>
      <DialogContent>
        {res != "success" ? <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Adding a new applicaion</DialogTitle>
          </DialogHeader>
          <DialogDescription>Fill in the form below to add a new application</DialogDescription>
          {res == "invalid" && <DialogDescription className="text-red-500">*Make sure you provide valid inputs</DialogDescription>}
          <div className="space-y-2">
            <div className="flex gap-2 items-center">
              <Input name="logo" type="text" placeholder="Logo url ~ " value={logo} onChange={e => setLogo(e.target.value)}/>
              <img src={logo ? logo : "https://cdn.icon-icons.com/icons2/2483/PNG/512/application_icon_149973.png"} alt="logo" className="w-12 h-12"/>
            </div>
            <Input name="name" type="text" placeholder="Application Name" required/>
            <Input name="login" type="text" placeholder="Username / Email / Phone.." required/>
            <div className="flex gap-2">
              <Input name="address" type="text" placeholder="Address" required/>
                <Select name="type" required={true}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Address type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="URL">URL</SelectItem>
                  <SelectItem value="IP">IP</SelectItem>
                </SelectContent>
              </Select>             
            </div>
            <div className="flex gap-2">
              <Input name="password" type={displayPassword ? "text" : "password"} placeholder="Password" required/>
              <Button type="button" variant="outline" onClick={() => setDisplayPassword(!displayPassword)} size="icon">{displayPassword ? <Eye/> : <EyeOff/>}</Button>
            </div>
          </div>
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={mutationStatus == "loading"}>Add Application</Button>
          </DialogFooter>
        </form>:
          <div>
          <DialogHeader>
            <DialogTitle>Successfully added a new application!</DialogTitle>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setResponse("none")}>Close</Button>
            </DialogClose>
            <Button onClick={() => setResponse("none")}>Add Another</Button>
          </DialogFooter>
          </div>
        }
      </DialogContent>
    </Dialog>
  );
}

export default AddApp
