"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { Button } from "../ui/button";
import { Eye, EyeOff, SquarePen } from "lucide-react";
import { Input } from "../ui/input";
import { useAdmin } from "../providers/admin-provider";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSession } from "../providers/session-provider";


const EditUser = ({user}) => {

  const permissions = useSession().session.user.permissions || [];
  const {editUser,roles,mutationStatus,setMutationStatus} = useAdmin()
  const [displayPassword,setDisplayPassword] = useState(false);
  const [res, setResponse] = useState("none");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMutationStatus("loading")
    const formData = new FormData(e.target);
    if(user.name == formData.get("name") && user.email == formData.get("email") && user.roleId == formData.get("roleId" && user.password == formData.get("password"))){
      toast({title:"Invalid",description:"No changes made to the user"})
      setResponse("invalid");
      setMutationStatus("none")
      return
    }
    editUser.mutate(formData)
  }

  useEffect(() => {
    if(mutationStatus == "ue_success"){
      setResponse("success")
      setMutationStatus("none")
    }
    if(mutationStatus == "ue_error"){
      setResponse("error")
      setMutationStatus("none")
    }
    if(mutationStatus == "ue_invalid"){
      setResponse("invalid")
      setMutationStatus("none")
    }
  },[mutationStatus,setMutationStatus])

  if((!permissions.includes("WRITE_USERS") || !permissions.includes("READ_ROLES") || !roles)  && !permissions.includes("MASTER")) return null

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" onClick={() => setResponse("none")}><SquarePen/></Button>
      </DialogTrigger>
      <DialogContent>
        {res != "success" ? <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editing a new user</DialogTitle>
          </DialogHeader>
          <DialogDescription>Fill in the form below to edit a user</DialogDescription>
          {res == "invalid" && <DialogDescription className="text-red-500">*Make sure you provide valid inputs</DialogDescription>}
          <div className="space-y-2 mt-2">
            <input type="hidden" name="id" value={user.id}/>
            <Input name="name" type="text" placeholder="Name" required defaultValue={user.name}/>
            <Input name="email" type="email" placeholder="Email" required defaultValue={user.email}/>
            <div className="flex gap-2">
              <Input name="password" type={displayPassword ? "text" : "password"} placeholder="Password" required defaultValue={user.password}/>
              <Button type="button" variant="outline" onClick={() => setDisplayPassword(!displayPassword)} size="icon">{displayPassword ? <Eye/> : <EyeOff/>}</Button>
            </div>
            <Select name="roleId" defaultValue={user.roleId} required={true}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>)}
              </SelectContent>
            </Select>             
          </div>
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline" type="reset">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={mutationStatus == "loading"}>Edit User</Button>
          </DialogFooter>
        </form>:
          <div>
          <DialogHeader>
            <DialogTitle>Successfully edited a new user!</DialogTitle>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setResponse("none")}>Close</Button>
            </DialogClose>
          </DialogFooter>
          </div>
        }
      </DialogContent>
    </Dialog>
  );
}

export default EditUser
