import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../axiosConfig";
import styles from "./PublicProfile.module.css";
import RecipeCard from "../../components/HomePage/RecipeCard/RecipeCard";

export default function PublicProfile() {
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [userRecipes, setUserRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await api.get(`/api/auth/users/${id}`);
        setUserProfile(res.data.user);
        setUserRecipes(res.data.recipes);
      } catch (err) {
        setError("Failed to load user profile.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  if (loading) return <p className={styles.loading}>Loading user profile...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;
  if (!userProfile) return <p className={styles.notFound}>User not found.</p>;

  return (
    <div className={styles.profileContainer}>
      <div className="container">
        <h2 className={styles.heading}>User Profile</h2>
        <div className={styles.profileInfo}>
          <img
            src={userProfile.avatar || `https://robohash.org/${userProfile.id}`}
            alt={userProfile.name}
            className={styles.profileAvatar}
          />
          <div className={styles.infoDetails}>
            <p className={styles.name}>@{userProfile.name}</p>
            <p className={styles.joinDate}>
              Joined: {new Date(userProfile.createdAt).toLocaleDateString()}
            </p>
            <p className={styles.recipesCount}>
              Recipes Published: {userProfile.recipesCount}
            </p>
          </div>
        </div>

        <h3 className={styles.sectionHeading}>Recipes by {userProfile.name}</h3>
        {userRecipes.length > 0 ? (
          <div className={styles.recipeGrid}>
            {userRecipes.map((r) => (
              <RecipeCard
                key={r._id}
                id={r._id}
                title={r.title}
                price={r.price || "$–"}
                img={r.image}
              />
            ))}
          </div>
        ) : (
          <p className={styles.noRecipes}>
            This user has not published any recipes yet.
          </p>
        )}
      </div>
    </div>
  );
}
