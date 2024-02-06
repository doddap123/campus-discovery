import User from "../../../db/model/User";
import CrudApiHandler from "../../../lib/CrudApiHandler";

const endpoint = new CrudApiHandler(User);

export default endpoint.handleIndex;
