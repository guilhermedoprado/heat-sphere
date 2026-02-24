import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RESOURCE_BY_TYPE_AND_SLUG, type ResourceType } from "../../data/resources";

export default function Shortcut({ type }: { type: ResourceType }) {
    const { slug } = useParams(); // params dinâmicos [web:108]
    const navigate = useNavigate();

    useEffect(() => {
        const key = `${type}:${slug}`;
        const r = slug ? RESOURCE_BY_TYPE_AND_SLUG[key] : undefined;
        navigate(r?.path ?? `/${type}s`, { replace: true });
    }, [type, slug, navigate]);

    return null;
}
