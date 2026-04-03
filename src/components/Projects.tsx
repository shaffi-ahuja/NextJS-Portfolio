"use client";
import React from "react";
import ProjectCard from "./ui/ProjectCard";
import AnimatedSection from "./ui/AnimatedSection";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/Carousel";

export default function Projects({ data }: { data: any[] }) {
  if (!data || data.length === 0) return null;
  const isMultiple = data.length > 1;

  return (
    <AnimatedSection className="section-container" direction="up" id="Projects">
      <h1 className="section-heading">My Recent Work</h1>
      <div className="px-10">
        <Carousel className="carousel-container" aria-label="Project showcase">
          <CarouselContent>
            {data.map((project: any) => (
              <CarouselItem key={project.title}>
                <ProjectCard
                  icon={project.icon}
                  title={project.title}
                  description={project.description}
                  techstack={project.techstack}
                  link={project.link}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          {isMultiple && <CarouselPrevious aria-label="Previous project" />}
          {isMultiple && <CarouselNext aria-label="Next project" />}
        </Carousel>
      </div>
    </AnimatedSection>
  );
}
