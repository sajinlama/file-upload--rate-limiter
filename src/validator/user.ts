import z from "zod"

const userSchema = z.object({
    fullname: z.string("valid username").min(5).max(20),

})

export default userSchema;