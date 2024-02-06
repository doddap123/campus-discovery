import CrudApiHandler from "../../../lib/CrudApiHandler";
import Location from "../../../db/model/Location";

const endpoint = new CrudApiHandler(Location);

export default endpoint.handleIndex;
