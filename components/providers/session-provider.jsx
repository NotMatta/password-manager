"use client"
import { createContext, useState, useEffect, useContext } from "react";
import { useToast } from "@/hooks/use-toast";
import { validatePassword, isValidEmail} from "@/lib/utils";

const SessionContext = createContext();


const SessionProvider = ({ children }) => {
  const [session, setSession] = useState({user:null,token:null,status:"loading"});
  const {toast} = useToast()
  

  useEffect(() => {

    const verifySession = async (token) => {
      if(!token) return false
      const res = await fetch("/api/auth/validate", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const {user} = await res.json()
      return user
    }

    const getLocalSession = async () => {
      const localSession = JSON.parse(localStorage.getItem("session"));
      if (localSession) {
        const user = await verifySession(localSession.token)        
        if (user) {
          setSession({...localSession,user:{...localSession.user,permissions:user.role.permissions},status:"authenticated"});
          localStorage.setItem("session", JSON.stringify({...localSession,user:{...localSession.user,permissions:user.role.permissions}}))
          return
        } else {
          localStorage.removeItem("session");
          setSession((old) => ({...old,status:"unauthenticated"}))
        }
        return
      }
      setSession((old) => ({...old,status:"unauthenticated"}))
    }
    getLocalSession();
  }, []);

  const editPassword = (formData) => {
  const body = {
    password:formData.get("password"),
    newPassword:formData.get("newPassword"),
    confirmPassword:formData.get("confirmPassword")
  };

  if(body.newPassword!== body.confirmPassword){
    toast({title:"Identifiants invalides",description:"Les mots de passe ne correspondent pas"});
    return;
  }

  if(!validatePassword(body.newPassword).isValid){
    toast({title:"Identifiants invalides",description:validatePassword(body.newPassword).message});
    return;
  }

  fetch("/api/auth/update", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${session.token}`,
    },
    body: JSON.stringify(body),
  })

.then((res) => {
    if(res.ok) {
      toast({title:"Mot de passe mis à jour",description:"Votre mot de passe a été mis à jour"});
      return;
    }
    const message = res.json();
    toast({title:"Impossible de mettre à jour le mot de passe",description:message});
  });
};

  const signOut = () => {
    localStorage.removeItem("session");
    setSession({user:null,token:null,status:"unauthenticated"})
  }

  const logIn = async (credentials) => {
    const {email,password} = {email:credentials.get("email"),password:credentials.get("password")};
    if(!validatePassword(password).isValid){
      toast({title:"Invalid credentials",description:validatePassword(password).message})
      return
    }
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({email,password}),
    })
    if(res.ok) {
      const {user,token} = await res.json()
      localStorage.setItem("session", JSON.stringify({user,token}))
      setSession({user,token,status:"authenticated"})
      return
    }
    const message = await res.json()
    toast({title:"Couldn't Log in",description:message})
  }

  if(session.status === "loading") return <div>Loading...</div>

  return (
    <SessionContext.Provider value={{session, signOut, logIn, editPassword}}>
      {children}
    </SessionContext.Provider>
  );
}

const useSession = () => {
  return useContext(SessionContext);
}

export { SessionProvider, useSession };
