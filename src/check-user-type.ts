
import { prisma } from "@/lib/prisma";

async function check() {
    const user = await prisma.user.findUnique({
        where: { email: "test@example.com" }
    });

    if (user) {
        console.log(user.password); // Should not error if password exists on type
    }
}
