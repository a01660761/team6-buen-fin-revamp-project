import { Card, CardContent, CardHeader } from "@mui/material";
import { useGetList, useTranslate } from "react-admin";

export const Dashboard = () => {
    const translate = useTranslate();

    const {
        total: totalPosts,
        isPending,
        error,
    } = useGetList("posts", {
        pagination: { page: 1, perPage: 10 },
        sort: { field: "id", order: "ASC" },
        filter: {},
    });

    return (
        <Card>
            <CardHeader title={translate("dashboard.title")} />

            <CardContent>
                {isPending && (
                    <p>{translate("dashboard.loading_posts")}</p>
                )}

                {error && (
                    <p>{translate("dashboard.error_loading_posts")}</p>
                )}

                {!isPending && !error && (
                    <p>
                        {translate("dashboard.total_posts", {
                            total: totalPosts,
                        })}
                    </p>
                )}
            </CardContent>
        </Card>
    );
};