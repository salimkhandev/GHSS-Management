import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Avatar, Skeleton } from "@mui/material";

const UserCard = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        setTimeout(() => {
            setUser({
                name: "Salim Khan",
                email: "salim@example.com",
                avatar: "https://i.pravatar.cc/150?img=3",
            });
            setLoading(false);
        }, 3000); // Simulating API delay
    }, []);

    return (
        <Card sx={{ width: 300, p: 2 }}>
            <CardContent>
                {loading ? (
                    <>
                        <Skeleton variant="circular" width={60} height={60} />
                        <Skeleton variant="text" width="80%" height={30} sx={{ mt: 1 }} />
                        <Skeleton variant="text" width="60%" height={20/} sx={{ mt: 1 }} />
                    </>
                ) : (
                    <>
                        <Avatar src={user.avatar} sx={{ width: 60, height: 60 }} />
                        <Typography variant="h6" sx={{ mt: 1 }}>
                            {user.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {user.email}
                        </Typography>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default UserCard;
