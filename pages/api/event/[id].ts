import CrudApiHandler from "../../../lib/CrudApiHandler";
import Event from "../../../db/model/Event";

const endpoint = new CrudApiHandler(Event);

export default endpoint.handleId;
