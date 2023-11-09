import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../App"
import { Outlet } from "react-router-dom";


const ClearSearch = (props)=>{
    const {search,setSearch} = useContext(AuthContext)
    const [loading,setLoadnig] = useState(true)
    const clearFunc = () => {
        let src = [...search]
        src.map((val)=>{
            if(val.name!==props.search){
                val.search=""    
            }
            return val
        })
        setSearch(src)
        setLoadnig(false)
    }
    
    useEffect(()=>{
        clearFunc()
    },[])
    // return (
    //     loading===false ?<Outlet/>:""
    // )
    // if(loading===false){
        return (
            <Outlet/>
        )
    // }
}

export default ClearSearch