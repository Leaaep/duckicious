import {pgEnum} from "drizzle-orm/pg-core/columns/enum";

export const seasons = pgEnum('seasons', ['spring', 'summer', 'autumn', 'winter'])