import { signOut } from "../../Store/Auth"
import { useDispatch } from "react-redux"
import { dropDatabaseAndTables } from "../Database/DropTable"

const dispatch = useDispatch()
export const logoutGlobal = async () => {
    await new Promise(resolve =>
        setTimeout(() => resolve(dropDatabaseAndTables()), 0),
    )
    await new Promise(resolve =>
        setTimeout(() => resolve(dispatch(signOut({}))), 1000),
    )
}