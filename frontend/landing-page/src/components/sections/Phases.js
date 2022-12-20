import classNames from "classnames";
import React, { useContext, useRef } from "react";
import { PhasesContext } from "../../context/contexts";
import Badge from "../elements/Badge";
import FeaturesTiles from "./FeaturesTiles";
import { Financing } from "./Financing";
import PhasesNavBar from "./partials/PhasesNavBar";
import { Partnership } from "./Partnership";

const Phases = () => {
  const phases = [
    {
      title: "Fase 1",
      code: "AEI-010500-2021b-122",
      stateKey: "under-construction",
      state: "Bajo construcción",
      illustration: "feature-tile-icon-02.svg",
      objectives: [
        {
          title: "Modelo de datos consistente",
          paragraph:
            "Obtener un modelo de datos que sustente el desarrollo del gemelo digital.",
        },
        {
          title: "Identificación de los datos",
          paragraph:
            "Identificar los datos necesarios para el desarrollo del gemelo digital.",
        },
        {
          title: "Funcionalidades",
          paragraph:
            "Especificar las funcionalidades que debe tener el gemelo digital.",
        },
        {
          title: "Primer demostrador",
          paragraph:
            "Contar con un primer demostrador alimentado con datos de una explotación real que sirva de base para las siguientes fases.",
        },
      ],
      partners: [
        { path: "virtalis-logo.png", link: "https://www.vitartis.es/" },
        { path: "7edata-logo.png", link: "https://www.7edata.com/" },
        {
          path: "agrointelligent-logo.webp",
          link: "https://www.agrointelligent.com/",
        },
        { path: "geoslab-logo.png", link: "https://www.geoslab.com/" },
        { path: "campg-logo.png", link: "https://campag.es/" },
        { path: "pystacil-logo.png", link: "https://pistacyl.com/" },
        { path: "cetemet-logo.png", link: "https://cetemet.es/" },
      ],
    },
    {
      title: "Fase 2",
      code: "AEI-010500-2022b-61",
      illustration: "feature-tile-icon-04.svg",
      stateKey: "under-construction",
      state: "Bajo construcción",
      objectives: [
        {
          title: "Análisis el mercado",
          paragraph:
            "Identificar y caracterizar todas las soluciones de mercado existentes capaces de aportar automatismos a la entrada de datos al gemelo.",
        },
        {
          title: "Análisis de sensórica",
          paragraph:
            "Establecer los sensores con los que se trabajará a nivel de prototipo demostrador y fijar las características de los datos que se recopilarán.",
        },
        {
          title: "Integración de datos de sensores",
          paragraph:
            "Definir la arquitectura software para la integración de los datos procedentes de los sensores seleccionados.",
        },
        {
          title: "Relaciones de realimentación",
          paragraph:
            "Identificar y caracterizar todas las relaciones de realimentación que sobre la explotación tienen los productos resultantes de los procesos de salida de la misma.",
        },
        {
          title: "Creación de algoritmos",
          paragraph:
            "Diseñar y construir los algoritmos de cálculo de estas relaciones.",
        },
        {
          title: "Integración de algoritmos",
          paragraph:
            "Definir la arquitectura software para la integración de los algoritmos de cálculo desarrollados en el prototipo de gemelo.",
        },
        {
          title: "Segundo demostrador",
          paragraph:
            "Disponer de una segunda implementación del sistema de información que constituye en gemelo digital.",
        },
      ],
      partners: [
        { path: "7edata-logo.png", link: "https://www.7edata.com/" },
        {
          path: "agrointelligent-logo.webp",
          link: "https://www.agrointelligent.com/",
        },
        { path: "geoslab-logo.png", link: "https://www.geoslab.com/" },
        { path: "campg-logo.png", link: "https://campag.es/" },
        { path: "pystacil-logo.png", link: "https://pistacyl.com/" },
        { path: "cetemet-logo.png", link: "https://cetemet.es/" },
      ],
    },
  ];

  const { currentPhase } = useContext(PhasesContext);
  const ref = useRef(null);

  return (
    <section className="center-content" id="phases">
      <div ref={ref} />
      <PhasesNavBar ref={ref} />
      <FeaturesTiles
        objectives={phases[currentPhase].objectives}
        illustration={phases[currentPhase].illustration}
        phase={phases[currentPhase].title}
      />
      <Partnership
        partners={phases[currentPhase].partners}
        phase={phases[currentPhase].title}
      />
      <Financing
        numExpte={phases[currentPhase].code}
        phase={phases[currentPhase].title}
        bottomDivider
      />
    </section>
  );
};

export default Phases;
