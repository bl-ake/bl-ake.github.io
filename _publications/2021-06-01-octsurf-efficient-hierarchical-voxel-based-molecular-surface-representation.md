---
title: "OctSurf: Efficient hierarchical voxel-based molecular surface representation for protein-ligand affinity prediction"
collection: publications
category: manuscripts
permalink: /publication/2021-06-01-octsurf-efficient-hierarchical-voxel-based-molecular-surface-representation
excerpt: "A novel 3D deep learning approach for protein-ligand binding affinity prediction using octree-based volumetric representation to efficiently characterize molecular surfaces."
date: 2021-06-01
venue: "Journal of Molecular Graphics and Modelling"
paperurl: "https://doi.org/10.1016/j.jmgm.2021.107865"
pdfurl: "/files/OctSurf- Efficient hierarchical voxel-based molecular surface representation for protein-ligand affinity prediction.pdf"
# citation: 'Liu, Q., Wang, P.-S., Zhu, C., Gaines, B. B., Zhu, T., Bi, J., & Song, M. (2021). "OctSurf: Efficient hierarchical voxel-based molecular surface representation for protein-ligand affinity prediction." <i>Journal of Molecular Graphics and Modelling</i>, 105, 107865.'
---

This work introduces OctSurf, a novel volumetric representation based on the octree data structure to characterize 3D molecular surfaces of protein binding pockets and bound ligands. Unlike traditional voxel-based approaches that divide 3D space into equal-sized voxels, OctSurf recursively partitions space into eight subspaces (octants), with only octants containing van der Waals surface points undergoing recursive subdivision. This approach significantly reduces memory usage and computational cost compared to conventional volumetric CNNs, making it tractable at higher resolutions while maintaining prediction accuracy for protein-ligand binding affinity.
